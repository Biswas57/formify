export const blocksConfig = {
  ID: {
    label: "ID",
    fields: ["Name", "Phone Number", "Email"],
  },
  IDExtended: {
    label: "ID Extended",
    fields: ["Name", "Phone Number", "Email", "Address", "Date of Birth"],
  },
  Medical: {
    label: "Medical",
    fields: ["Allergies", "Current Medications", "Medical History"],
  },
  // Add new block types as needed:
  MedicalProfessional: {
    label: "Medical Professional",
    fields: ["Name", "License Number", "Specialization", "Years of Experience"],
  },
  Education: {
    label: "Education",
    fields: ["School Name", "Degree", "Major", "Graduation Year"],
  },
  // etc.
};
