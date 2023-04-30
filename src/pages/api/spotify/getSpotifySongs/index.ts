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

  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${q}&type=${type}`,
    details
  );
  // const data = await response.json();
  // res.status(200).json(response.data)
  if (response.status === 200) {
    return res.send(response.data);
  }
};

export default getSpotifySongs;
