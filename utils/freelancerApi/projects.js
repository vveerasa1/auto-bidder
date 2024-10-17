const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const GET_ACTIVE_PROJECT_URL =
  "https://www.freelancer.com/api/projects/0.1/projects/active/";

/**
 * https://www.freelancer.com/api/projects/0.1/projects/active/?compact=&limit=3&project_types%5B%5D=fixed&max_avg_price=500%3D&min_avg_price=250&query=django
 */
const getAllActiveProjects = async (limit, token) => {
  try {
    const response = await fetch(GET_ACTIVE_PROJECT_URL + `?limit=${limit}`, {
      method: "GET",
      headers: { "freelancer-oauth-v1": token },
    });
    if (!response.ok) {
      return {
        success: false,
        error: "error while fetching the active projects",
      };
    }

    const responseData = await response.json();
    console.log("Success:", responseData);
    return {
      success: true,
      data: responseData, // Return the data from the response
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
