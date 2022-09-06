const express = require('express')
const app = express()

const PORT = process.env.PORT || 8080



app.get('/login', (req, res) => {
  const parsedData = req.body
  console.log('login route accessed');
  console.log(req);

  res.status(200).send({ body: req.body });

  return

  const { email, password } = parsedData

})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))