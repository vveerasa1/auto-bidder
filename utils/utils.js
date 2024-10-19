const convertUserSkillToString = (userSkill) => {
  const { skills: currentSkill } = userSkill?.skills;
  const ids = currentSkill.map((skill) => skill.id); // Extract the ids
  return `jobs[]=${ids.join("&jobs[]=")}`; // Create the query string
};

module.exports = {
  convertUserSkillToString,
};
