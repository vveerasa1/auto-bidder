const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const config = require("../../config");

const sentAuthorizationGrant = async (code) => {
  const { Oauth_token_URL, client_id, redirect_URI, client_secret } =
    config.freelancer;

  const payload = `grant_type=authorization_code&code=${code}&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_URI}`;

  try {
    const response = await fetch(Oauth_token_URL, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: payload, // Sending the grant data in JSON format
    });

    console.log(response.ok);
    if (!response.ok) {
      return {
        success: false,
        error: "my error",
      };
    }

    const responseData = await response.json();

    const userdata = await fetchUserData(responseData);
    console.log(userdata, "successful user fetched");
    return {
      success: true,
      data: {
        userdata,
        tokendata: responseData,
      }, // Return the data from the response
    };
  } catch (error) {
    console.error("Error during authorization grant:", error);
    return {
      success: false,
      error: error, // Return the error message
    };
  }
};

const fetchUserData = async (data) => {
  console.log(data, "token recieved");
  try {
    const response = await fetch(
      `https://www.freelancer-sandbox.com/api/users/0.1/self/?avatar=true&profile_description=true&portfolio_details=true&jobs=true`,
      {
        method: "GET",
        headers: {
          "freelancer-oauth-v1": data?.access_token,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "error while fetching the user data",
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData, // Return the data from the response
    };
  } catch (error) {
    console.error("Error during authorization grant:", error);
    return {
      success: false,
      error: error, // Return the error message
    };
  }
};

module.exports = {
  sentAuthorizationGrant,
};
