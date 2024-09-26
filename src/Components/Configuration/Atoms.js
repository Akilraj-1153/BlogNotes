import { atom } from "recoil";

export const DarkTheme = atom({
  key: "DarkTheme",
  default: false,
});

export const UserAuthDetails = atom({
  key: "UserAuthDetails",
  default: {},
});

export const CurrentEditorPage = atom({
  key: "CurrentEditorPage",
  default: "Editor",
});

export const blogStructure = atom({
  key: "blogStructure",
  default: {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} },
  },
});

export const texteditor = atom({
  key: "texteditor",
  default: false,
});

export const NavHeight = atom({
  key: "NavHeight",
  default: 0,
});

export const UserProfile = atom({
  key: "UserProfile",
  default: {
    personal_info: {
      fullname: "",
      email: "",
      username: "",
      profile_img: "",
      bio: "",
    },
    social_links: {
      facebook: "",
      github: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      website: "",
      youtube: "",
    },
    account_info: {
      total_posts: 0,
      total_reads: 0,
    },
    joinedAt: "",
    github_auth: null,
  },
});


