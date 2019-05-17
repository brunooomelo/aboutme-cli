const axios = require('axios')

const api = axios.create({
  baseURL: 'https://api.github.com/users'
})

const profile = async username  => {
  const [profile, gists] = await Promise.all([api.get(`/${username}`), api.get(`/${username}/gists`)])

  return {
    name: profile.data.name,
    avatar: profile.data.avatar_url,
    blog: profile.data.blog,
    bio: profile.data.bio || '404 - Not Bio',
    repos: profile.data.public_repos,
    location: profile.data.location,
    gists:  profile.data.public_gists,
    followers: profile.data.followers,
    following: profile.data.following,
    files: gists.data
  }
}

module.exports = profile
