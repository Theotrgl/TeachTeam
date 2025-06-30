import gql from "graphql-tag";

export const typeDefs = gql`
  type Profile {
    id: ID!
    about: String!
    pictureURI: String!
    prevRoles: [PrevRole!]!
    availability: String!
    skills: [String!]!
    credentials: [String!]!
    agg_selected: Int!
  }

  type PrevRole {
    id: ID!
    title: String!
    description: String!
    profile: Profile!
  }

  type Courses {
    id: ID!
    code: String!
    title: String!
    desc: String!
    role: String!
    lecturer: User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String!
    profile: Profile
    createdAt: String!
    updatedAt: String!
    isBlocked: Boolean!
  }

  type Comments {
    lecturer_id: ID!
    tutor_id: ID!
    comment: String!
  }

  type SelectedCourses {
    id: ID!
    courses: [Courses!]!
    user: User!
  }

  type SelectedTutors {
    id: ID!
    tutors: [User!]!
    lecturerId: Int!
  }

  type TutorOrder {
    id: ID!
    userId: Int!
    tutorIds: [Int!]!
  }

  type Candidate {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type CourseCandidates {
    id: ID!
    title: String!
    candidates: [Candidate!]!
  }

  type Query {
    profiles: [Profile!]!
    profile(id: ID!): Profile

    courses: [Courses!]!
    course(id: ID!): Courses

    users: [User!]!
    user(id: ID!): User

    selectedCourses: [SelectedCourses!]!
    selectedTutors: [SelectedTutors!]!
    tutorOrders: [TutorOrder!]!
    comments: [Comments!]!
    prevRoles: [PrevRole!]!
    candidatesPerCourse: [CourseCandidates!]!
    candidatesWithMoreThan3Courses: [User!]!
    candidatesWithNoCourses: [User!]!

    login(username: String!, password: String!): String
  }

  type Mutation {
    createProfile(
      about: String!
      pictureURI: String!
      prevRoles: [PrevRoleInput!]
      availability: String!
      skills: [String!]!
      credentials: [String!]!
      agg_selected: Int!
    ): Profile!

    updateProfile(
      id: ID!
      about: String
      pictureURI: String
      availability: String
      skills: [String!]
      credentials: [String!]
      agg_selected: Int
    ): Profile!

    deleteProfile(id: ID!): Boolean!

    createCourse(
      code: String!
      title: String!
      desc: String!
      role: String!
    ): Courses!

    updateCourse(
      id: ID!
      code: String
      title: String
      desc: String
      role: String
    ): Courses!

    deleteCourse(id: ID!): Boolean!

    assignLecturerToCourse(courseId: ID!, lecturerId: ID!): Courses!

    blockUser(userId: ID!): User!
    unblockUser(userId: ID!): User!
  }

  input PrevRoleInput {
    title: String!
    description: String!
  }
`;
