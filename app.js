const express = require("express");
let axios = require("axios").default;
var request = require("request-promise");

const app = express();
//api credentials
CHAPA_PUBLIC_KEY = "CHAPUBK_TEST-aKAH2wGbsqXEjHIbfuEiqsgSjl2jQ8J2";

CHAPA_SECRET_KEY = "CHASECK_TEST-cuK7qk1gVkwa2KT473GIvpnGVj0MOi9S";

let config = {
  headers: {
    Authorization: "Bearer " + CHAPA_SECRET_KEY,
  },
};

app.post("/order", async (req, res) => {
  //payment initiation

  try {
    let tx_ref = "tx-myecommerce12345." + Date.now();
    let result = await axios.postForm(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: "300",
        key: CHAPA_PUBLIC_KEY,
        currency: "ETB",
        email: "aman@gmail.com",
        first_name: "Abebe",
        last_name: "Bikila",
        tx_ref: tx_ref,
        callback_url: "http://localhost:3001/api/success?tx_ref=" + tx_ref,
        "customization[title]": "I love e-commerce",
        "customization[description]": "It is time to pay",
      },
      config
    );

    console.log(result.data);

    //returning back the checkout url

    res.send(result.data);
  } catch (error) {
    console.log(error.data);
    res.send("error message " + error);
  }
});

app.get("/api/success", async (req, res) => {
  //payment verification

  console.log(
    "executed when payment is successful-redirected by chapa to this url"
  );

  try {
    //https://api.chapa.co/v1/transaction/verify/tf_ref-some_ref
    let options = {
      method: "GET",
      url: "https://api.chapa.co/v1/transaction/verify/" + req.query.tx_ref,
      headers: {
        Authorization: "Bearer " + CHAPA_SECRET_KEY,
      },
      json: true,
    };
    let resu = await request(options);
    console.log("resuult " + resu);
    res.send(resu);
    // let result = await axios.get(
    //   "https://api.chapa.dev/v1/transaction/verify/" + req.query.tx_ref,
    //   {
    //     headers: {
    //       Authorization: "Bearer " + CHAPA_SECRET_KEY,
    //     },
    //   }
    // );

    console.log("Result: " + result.data);
    //TODO: save transaction
    res.send(" payment transaction result " + result.data);
  } catch (error) {
    console.log("something happened " + error);
    res.send(" something happened " + error);
  }
});
app.listen(3001, () => console.log("app running on port 3001"));

//CHAPA_WEBHOOK_SECRET='My_webook_secret_key123';
/*

Card number: 4200 0000 0000 0000
cvv: 123
Expiry: "12/34"
*/
