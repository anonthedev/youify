import { NextApiRequest, NextApiResponse } from "next";
// import { baseURL } from "@/Components/Data/BaseURL";
// import axios from "axios";
const getSpotifySongs = async (req, res) => {
  const {q, type} = typeof req.query === "object" ? req.query : JSON.parse(req.query);
  // console.log(q);
  //   const userId = params[0];
  //   const component = params[1];
  // console.log(req.formData())
  // delete options.headers['Content-Type'];
  // console.log(req.method);

  //   console.log(userId);
  // console.log(component);

  const details = {
    method: req.method,
    headers: req.headers,
  };
  // console.log(details)
  // delete details.headers['Content-Type'];

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=${type}`,
    details
  );
  const data = await response.json();
  console.log(data);
  return res.end(JSON.stringify(data));
};

export default getSpotifySongs;
