import { useLocation } from "react-router-dom";

const ACCOUNT_PATH_REGEX = /^\/account\/([\w\d]+)(?:\/[\w\d]+)*$/;

/* Gives the account id of the current path if possible, 
   returns null otherwise. */
export function useAccountLocation() {
  const location = useLocation();

  const matches = ACCOUNT_PATH_REGEX.exec(location.pathname);

  if (matches && matches.length >= 1) {
    return matches[1];
  }

  return null;
}