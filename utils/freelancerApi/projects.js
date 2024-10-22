const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const config = require("../../config");

const GET_PROJECT_URL = `${config.freelancer.env_base_URL}/api/projects/0.1/projects/active/`;

/**
 * https://www.freelancer.com/api/projects/0.1/projects/active/?compact=&limit=3&project_types%5B%5D=fixed&max_avg_price=500%3D&min_avg_price=250&query=django
 */
const getAllActiveProjects = async (limit, offset, token, skillsResult) => {
  try {
    console.log(`${GET_PROJECT_URL}?limit=${limit}&offset=${offset}`, "my url");
    const response = await fetch(
      `https://${
        config.freelancer.freelancer_URL
      }/api/projects/0.1/projects/active/?limit=${limit}&offset=${offset}&full_description=true&job_details=true&user_details=true&user_display_info=true&user_country_details=true${
        skillsResult.length > 0 ? "&" + skillsResult : ""
      }`,
      {
        method: "GET",
        headers: { "freelancer-oauth-v1": token },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "error while fetching the active projects",
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData?.result, // Return the data from the response
    };
  } catch (error) {
    return {
      success: false,
      data: error,
    };
  }
};

//find the project required skills
const findRequiredSkills = async (projectId, token) => {
  try {
    const response = await fetch(
      `https://${config.freelancer.freelancer_URL}/api/projects/0.1/projects/${projectId}/?job_details=true&user_details=true&user_display_info=true&user_profile_description=true`,
      {
        method: "GET",
        headers: { "freelancer-oauth-v1": token },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "error while fetching the project by Id",
      };
    }

    const responseData = await response.json();
    console.log(responseData);
    return {
      success: true,
      data: responseData?.result?.jobs, // Return the data from the response
      projectDetails: responseData?.result,
    };
  } catch (error) {
    return {
      success: false,
      data: error,
    };
  }
};

//add the required skills if not in the list
const addRequiredSkills = async (data, token) => {
  try {
    const response = await fetch(
      `https://${config.freelancer.freelancer_URL}/api/users/0.1/self/jobs`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "freelancer-oauth-v1": token,
        },
        body: data,
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "error while fetching the required skills for the project",
      };
    }

    const responseData = await response.json();
    return {
      success: true,
      data: responseData?.result, // Return the data from the response
    };
  } catch (error) {
    return {
      success: false,
      data: error,
    };
  }
};

//place-Bid for the user
const placeBidForProjects = async (data, token) => {
  /**
   * * BODY_DATA
   * project_id
   * bidder_id
   * amount
   * period
   * milestone_percentage
   * description
   */
  console.log(data);
  try {
    const response = await fetch(
      `https://${config.freelancer.freelancer_URL}/api/projects/0.1/bids/?compact=`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "freelancer-oauth-v1": token,
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: response.statusText,
      };
    }

    return {
      success: true,
      data: responseData?.result, // Return the data from the response
    };
  } catch (error) {
    return {
      success: false,
      data: error,
    };
  }
};

module.exports = {
  getAllActiveProjects,
  findRequiredSkills,
  addRequiredSkills,
  placeBidForProjects,
};
