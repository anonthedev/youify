import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const getSpotifySongs = async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, type } =
    typeof req.query === "object" ? req.query : JSON.parse(req.query);

  const details = {
    method: req.method,
    headers: { Authorization: `${req.headers.authorization}` },
  };
  // console.log(details);

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=${type}`,
    details
  );
  const data = await response.json();
  // console.log(data);
  return res.end(JSON.stringify(data));
};

export default getSpotifySongs;
