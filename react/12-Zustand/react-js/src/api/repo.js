import axios from "./config";

export const getReps = async (owner, repo) => {
    const res = await axios.get(`/repos/${owner}/${repo}`);
    return res.data;
};

export const getRepoList = async (owner) => {
    const res = await axios.get(`/users/${owner}/repos`);
    return res.data;
}
