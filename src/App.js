import "bootstrap";
import "./style.scss";
import React, { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Commitment from "./components/Commitment.js";
import CommitmentFeatured from "./components/CommitmentFeatured.js";
import Select from "./components/Select.js";
import { Bar } from "react-chartjs-2";
import * as Constants from "./constants";
import { FEATUREDARRAY } from "./constants/index.js";
import resizingFunctions from "./constants/resizing.js";
function rnToHTMLObj(str, maxchar, commitment_nr) {
  const regex = /\\+r\\+n/gi;
  let clean = str.replace(regex, "<br>");
  if (clean.length > maxchar) {
    clean =
      clean.substring(0, maxchar - 1) +
      '... <a href="https://sustainabledevelopment.un.org/partnership/?p=' +
      commitment_nr +
      '" target="_blank" rel="noopener noreferrer">(Read more)</a>';
  }
  return { __html: "<p>" + clean + "</p>" };
}
function App() {
  const [commitments, setCommitments] = useState({});
  const [orderBy, setOrderBy] = useState("dateadded");
  const [direction, setDirection] = useState("desc");
  const [activePage, setActivePage] = useState(1);
  const [start, setStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [comsPerSDGs, setComsPerSDGs] = useState({});
  const [featured, setFeatured] = useState([]);
  const Rows = 10;
  async function fetchData(
    an = 0,
    start = 0,
    rows = Rows,
    orderby = "dateadded",
    direction = "desc"
  ) {
    const res = await fetch(
      Constants.URL +
        "getCommitments.php?start=" +
        start +
        "&rows=" +
        rows +
        "&orderby=" +
        orderby +
        "&direction=" +
        direction +
        "&an=" +
        an +
        "&flushcache=" +
        Constants.FLUSHCACHE
    );
    res
      .json()
      .then(res => {
        Object.keys(res).map(i => {
          res[i].intro = rnToHTMLObj(
            res[i].intro,
            Number.MAX_SAFE_INTEGER,
            null
          );
          return 0;
        });
        setCommitments(res);
      })
      .catch(err => console.log("API Commitments error: " + err));
    const res2 = await fetch(
      Constants.URL +
        "getSDGsActionNetwork.php?an=" +
        an +
        "&flushcache=" +
        Constants.FLUSHCACHE
    );
    res2
      .json()
      .then(res2 => {
        setTotal(res2[0]);
        setComsPerSDGs(res2);
      })
      .catch(err => console.log("API SDGS error: " + err));
    if (featured.length < FEATUREDARRAY.length) {
      FEATUREDARRAY.forEach(async cnr => {
        const res3 = await fetch(
          Constants.URL +
            "getCommitments.php?cnr=" +
            cnr +
            "&flushcache=" +
            Constants.FLUSHCACHE
        );
        res3
          .json()
          .then(res3 => {
            res3.map(key => {
              res3[0].intro = rnToHTMLObj(
                res3[0].intro,
                500,
                res3[0].commitment_nr
              );
              //res3[0].partners = rnToHTMLObj(res3[0].partners, 500);
              return 0;
            });
            setFeatured(featured => [...featured, res3[0]]);
          })
          .catch(err => console.log("API SDGS error: " + err));
      });
    }
  }
  useEffect(() => {
    fetchData(Constants.ActionNetwork);
  }, []);
  function handleOrderChange(e) {
    fetchData(Constants.ActionNetwork, start, Rows, e.target.value);
    setOrderBy(e.target.value);
    e.preventDefault();
  }
  function handleDirectionChange(e) {
    fetchData(Constants.ActionNetwork, start, Rows, orderBy, e.target.value);
    setDirection(e.target.value);
    e.preventDefault();
  }
  function handlePageChange(pageNumber) {
    let s = pageNumber * Rows - Rows;
    fetchData(Constants.ActionNetwork, s, Rows, orderBy, direction);
    setActivePage(pageNumber);
    setStart(s);
  }
  const directionOptions = [
    { asc: "Ascendent (a-z, or older first)" },
    { desc: "Descendent (z-a or most recent first)" }
  ];
  const orderOptions = [
    { dateadded: "Date registered" },
    { title: "Title" },
    { leadorg: "Organization" }
  ];
  // bar chart logic
  const graphKeys = () => {
    let arr = [];
    Object.keys(comsPerSDGs).map(key => {
      if (key > 0) {
        arr.push("SDG " + key);
      }
      return 0;
    });
    return arr;
  };
  const graphVals = () => {
    let arr = [];
    Object.keys(comsPerSDGs).map(key => {
      if (key > 0) {
        arr.push(comsPerSDGs[key]);
      }
      return 0;
    });
    return arr;
  };
  const graphData = {
    labels: graphKeys(),
    datasets: [
      {
        label: "Number of acceleration actions",
        data: graphVals(),
        backgroundColor: Constants.SDGCOLORS.slice(1)
      }
    ]
  };
  const featuContent = () => {
    const content = [];
    let f = featured;
    for (let i = 0; i < featured.length; i += 2) {
      content.push(
        <div className="row">
          <CommitmentFeatured
            key={f[i].commitment_nr}
            commitment={f[i]}
          ></CommitmentFeatured>
          {f[i + 1] && (
            <CommitmentFeatured
              key={f[i + 1].commitment_nr}
              commitment={f[i + 1]}
            ></CommitmentFeatured>
          )}
        </div>
      );
    }
    return content;
  };
  const willShowTotal = () => {
    let message = <div>Browse</div>;
    if (Constants.SHOWTOTAL) {
      message = (
        <div>
          Browse the <strong>{total}</strong> submissions
        </div>
      );
    }
    return message;
  };
  return (
    <div className="App">
      <div className="row">
        <div className="col">
          <h2 id="subtitle">Total: {total}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Bar
            data={graphData}
            width={100}
            height={22}
            options={{
              maintainAspectRatio: true,
              title: {
                display: true,
                text: "Number of Acceleration Actions per SDG",
                fontSize: 16,
                lineHeight: 1.8
              },
              legend: {
                display: false
              }
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-9">
          <h3>Featured</h3>
          {featuContent()}
        </div>
        <div className="col-md-3">
          <h3>More information</h3>
          <a
            href="https://sustainabledevelopment.un.org/sdgsummit#acceleration-actions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="//sustainabledevelopment.un.org/content/images/SDG_AccelerationActions_flyer2.png"
              alt="SDG Acceleration Actions flyer"
              className="img-fluid"
            ></img>
          </a>
          <p></p>
          <p>
            Submissions will be reviewed by DESA in accordance with a set of
            criteria (
            <a href="//sustainabledevelopment.un.org/sdgsummit#acceleration-actions">
              see FAQ for details
            </a>
            ). Governments, businesses and other stakeholders making the most
            innovative, ambitious and impactful commitments will be invited to
            announce their SDG Acceleration Actions to the media via the VIP
            social media studio or the SDG Media Zone.
          </p>
          <p>Registration is now open online.</p>
          <p>
            <strong>More information:</strong>
          </p>
          <ul>
            <li>
              <a href="/partnership/register/?source=90">
                Register your SDG Acceleration Action
              </a>
            </li>
            <li>
              <a
                href="/content/documents/23771General_Information_SDG_Acceleration_Actions_Call.pdf"
                target="_blank"
              >
                Information Note
              </a>
            </li>
          </ul>
          <p>
            <strong>SDG Acceleration Actions - promotional flyers:</strong>
          </p>
          <ul>
            <li>
              <a
                href="/content/documents/SDG_Acceleration_Actions_flyer_AR.pdf"
                target="_blank"
              >
                AR
              </a>{" "}
              |
              <a
                href="/content/documents/SDG_Acceleration_Actions_flyer_ZH.pdf"
                target="_blank"
              >
                ZH{" "}
              </a>{" "}
              |
              <a
                href="/content/documents/SDG_Acceleration_Actions_flyer_EN.pdf"
                target="_blank"
              >
                EN{" "}
              </a>{" "}
              |
              <a
                href="/content/documents/SDG_Acceleration_Actions_flyer_FR.pdf"
                target="_blank"
              >
                FR{" "}
              </a>{" "}
              |
              <a
                href="/content/documents/SDG_Acceleration_Actions_flyer_RU.pdf"
                target="_blank"
              >
                RU{" "}
              </a>{" "}
              |
              <a
                href="/content/documents/SDG_Acceleration_Actions_flyer_ES.pdf"
                target="_blank"
              >
                ES{" "}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h3>{willShowTotal()}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Select
            value={orderBy}
            options={orderOptions}
            onChange={handleOrderChange}
          />
          <Select
            value={direction}
            options={directionOptions}
            onChange={handleDirectionChange}
          />
        </div>
        <div className="col-md-6" id="top-pagination">
          <div id="pagibox" className="justify-content-end">
            <Pagination
              prevPageText="prev"
              nextPageText="next"
              firstPageText="first"
              lastPageText="last"
              activePage={activePage}
              itemsCountPerPage={Rows}
              totalItemsCount={total}
              pageRangeDisplayed={3}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <p>&nbsp;</p>
      <div className="row">
        <div className="col">
          {Object.keys(commitments).map((key, index) => (
            <Commitment
              key={commitments[key].commitment_nr}
              commitment={commitments[key]}
            ></Commitment>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "3em"
            }}
          >
            <Pagination
              prevPageText="prev"
              nextPageText="next"
              firstPageText="first"
              lastPageText="last"
              activePage={activePage}
              itemsCountPerPage={Rows}
              totalItemsCount={total}
              pageRangeDisplayed={3}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
resizingFunctions();
export default App;
