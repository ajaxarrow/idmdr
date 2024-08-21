import {v4 as uuidv4} from "uuid";

export const useAuthUrls = () =>{
  // @ts-ignore
  // const {VITE_GOOGLE_OAUTH_CLIENT_ID, VITE_REDIRECT_URI, VITE_GOOGLE_OAUTH_CLIENT_SECRET} = import.meta.env
  const getGithubUrl = () => {

    const stateValue = uuidv4();
    const rootURl = 'https://github.com/login/oauth/authorize';
    const options = {
      client_id: import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL,
      scope: 'user:email',
      state: stateValue
    };

    const qs = new URLSearchParams(options);

    window.location.href = `${rootURl}?${qs.toString()}`

  }

  const getGoogleUrl = () => {
    window.location.href = `${import.meta.env.VITE_BASE_API_URL_DJANGO}/api/login-google`
  }

  return {getGithubUrl, getGoogleUrl}
}