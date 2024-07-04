import {ref} from "vue";
import {repositories} from "../../../data/repository.ts";

export const useTags = () => {
  const selectedTags = ref<string[]>([]);
  const tags = ref(['Agriculture', 'Plantation', 'Forestry', 'Agrifishery']);

  const fetchTags = () => {
    repositories.forEach(repo => {
      repo.tags?.forEach(tag => {
        if (!tags.value.includes(tag)){
          tags.value.push(tag);
        }
      })
    })

    sortTags();
  }

  const sortTags = () => {
    tags.value.sort((a, b) => {

      const titleA = a.toLowerCase();
      const titleB = b.toLowerCase();

      if (titleA < titleB) {
        return -1;
      } else if (titleA > titleB) {
        return 1;
      }
      return 0;
    });
  };

  return {selectedTags, tags, fetchTags}
}