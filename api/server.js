export default (req, res) => {
  if (req.method === "GET") {
    // Handle GET request
    res.status(200).json({ message: "GET request received" });
  } else if (req.method === "POST") {
    // Handle POST request
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
