import axios from "axios";
require("dotenv").config();

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const result = await axios.get(
        `${process.env.API_URL}/trending/movie/day?api_key=${process.env.API_KEY}`
      );
      // Send the actual data received from Axios
      res.status(200).json(result.data);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      res.status(500).json({ error: "Failed to fetch trending movies" });
    }
  } else if (req.method === "POST") {
    const { name } = req.body;
    res
      .status(201)
      .json({ message: `POST request received with name: ${name}` });
  } else {
    // Handle other HTTP methods
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
