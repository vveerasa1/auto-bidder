const convertUserSkillToString = (userSkill) => {
  const { skills: currentSkill } = userSkill?.skills;
  const ids = currentSkill.map((skill) => skill.id); // Extract the ids
  return `jobs[]=${ids.join("&jobs[]=")}`; // Create the query string
};

/* find missing skills */
function findMissingSkills(mySkills, requiredSkills) {
  // Extract skill names from mySkills
  const mySkillIds = mySkills.map((skillObj) => skillObj.id);

  // Find required skills not in mySkills
  const missingSkills = requiredSkills.filter(
    (skillObj) => !mySkillIds.includes(skillObj.id)
  );
  const ids = missingSkills.map((job) => job.id); // Extract IDs
  return {
    missingSkills: missingSkills,
    skillId: JSON.stringify({ "jobs[]": ids }),
  }; // Convert to
}

module.exports = {
  convertUserSkillToString,
  findMissingSkills,
};
