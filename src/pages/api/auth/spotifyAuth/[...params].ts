import { NextApiRequest, NextApiResponse } from "next";
// import { baseURL } from "../../../Components/Data/BaseURL";

const spotifyAuth: any = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userEmail, fullName } =
    typeof req.body === "object" ? req.body : JSON.parse(req.body);
  const { params } = req.query;
  console.log(params)
  // const createUsernameParams = {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     userEmail: userEmail,
  //     fullName: fullName,
  //   }),
  // };
  // const resp = await fetch(`${AUTHORIZE}?`, createUsernameParams);
  // const data = await resp.json();

  // return res.end(JSON.stringify(data));
};

export default spotifyAuth;
