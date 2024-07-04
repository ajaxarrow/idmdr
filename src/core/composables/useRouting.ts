import {useRoute, useRouter} from "vue-router";

export const useRouting = () => {
  const router = useRouter();
  const route = useRoute();

  return {route, router}
}