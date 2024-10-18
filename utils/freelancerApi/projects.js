const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const config = require("../../config");

const GET_PROJECT_URL = `${config.freelancer.env_base_URL}/api/projects/0.1/projects/active/`;

/**
 * https://www.freelancer.com/api/projects/0.1/projects/active/?compact=&limit=3&project_types%5B%5D=fixed&max_avg_price=500%3D&min_avg_price=250&query=django
 */
const getAllActiveProjects = async (limit, offset, token) => {
  try {
    console.log(`${GET_PROJECT_URL}?limit=${limit}&offset=${offset}`, "my url");
    const response = await fetch(
      `https://www.freelancer.com/api/projects/0.1/projects/active/?limit=${limit}&offset=${offset}&full_description=true&job_details=true&user_details=true&user_display_info=true`,
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

module.exports = {
  getAllActiveProjects,
};
