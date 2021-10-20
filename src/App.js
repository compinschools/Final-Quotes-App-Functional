import React, { useState, useEffect } from "react";
import { ApiClient } from "./ApiClient.js";

function App() {
  const [quotes, cQuotes] = useState({
    content: "",
    author: "",
    tags: [],
  });
  const [fetching, cFetching] = useState(false);
  const [authors, cAuthors] = useState([]);
  const [lastIndex, cLastIndex] = useState(0);
  const [pageSize, cPageSize] = useState(20);
  const [authorId, cAuthorId] = useState(undefined);

  const apiClient = new ApiClient();

  const refreshQuote = () => {
    cQuotes({
      content: "...loading",
      author: "...loading",
      tags: [],
    });
    cFetching(true);
    if (authorId) {
      apiClient
        .getQuoteByAuthor(authorId)
        .then((response) => {
          updateQuote(
            response.data.results[
              Math.floor(Math.random() * response.data.count)
            ]
          );
        })
        .finally(() => {
          cFetching(false);
        });
    } else {
      apiClient
        .getQuote()
        .then((res) => {
          updateQuote(res.data);
        })
        .finally(cFetching(false));
    }
  };

  const updateQuote = (responseObject) => {
    cQuotes({
      content: responseObject.content,
      author: responseObject.author,
      tags: responseObject.tags,
    });
  };

  const updateAuthors = (response) => {
    console.log(response);
    const authorList = response.results.map((author) => ({
      name: author.name,
      count: author.quoteCount,
      id: author._id,
    }));
    cAuthors(authorList);
  };

  const listAuthors = (skip = 0) => {
    skip = skip > 0 ? skip : 0;
    console.log(skip);
    apiClient.getAuthors(skip, pageSize).then((response) => {
      updateAuthors(response.data);
    });
  };

  const refreshAuthors = (next) => {
    if (next) {
      listAuthors(lastIndex);
      cLastIndex(lastIndex + pageSize);
    } else {
      listAuthors(lastIndex - pageSize * 2);
      cLastIndex(lastIndex < pageSize ? pageSize : lastIndex - pageSize);
    }
  };

  const refreshPagination = (event) => {
    cPageSize(parseInt(event.target.value));
  };

  useEffect(() => {
    refreshQuote();
    listAuthors();
  }, []);

  useEffect(() => {
    cLastIndex(pageSize);
    listAuthors(lastIndex);
  }, [pageSize]);

  useEffect(() => {
    refreshQuote();
  }, [authorId]);

  const makeAuthorTable = () => {
    return authors.map((author, index) => {
      return (
        <tr key={index}>
          <td
            style={{ backgroundColor: authorId === author.id ? "green" : "" }}
          >
            <a onClick={() => cAuthorId(author.id)}>{author.name}</a>
          </td>
          <td>{author.count}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <h1>Quote of the day</h1>
      <p>
        <b>Content:</b> {quotes.content}{" "}
      </p>
      <p>
        <b>Author:</b> {quotes.author}{" "}
      </p>
      <p>
        <b>Tags:</b> {quotes.tags.join(", ")}
      </p>
      <button disabled={fetching} onClick={() => refreshQuote()}>
        New Quote
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>No of quotes</th>
          </tr>
        </thead>
        <tbody>{makeAuthorTable()}</tbody>
      </table>
      <button onClick={() => refreshAuthors(false)}>Prev</button>
      <button onClick={() => refreshAuthors(true)}>Next</button>
      <br /> Page Size
      <br />
      <select onChange={(e) => refreshPagination(e)} value={pageSize}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
    </>
  );
}

export default App;

function press(e) {
  const dict = {
    a: () => {
      console.log("a");
    },
    b: () => {
      console.log("b");
    },
    c: () => {
      console.log("c");
    },
  };
}
