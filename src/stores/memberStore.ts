import {orgmembers} from "../data/members.ts";
import {ref} from "vue";
import {Member} from "../interfaces/member.interface.ts";
import {createGlobalState} from "@vueuse/core";


const members = ref(orgmembers);

const addMember = (member: Member) => {
  members.value = [...members.value, member];
}

export const useMemberStore = createGlobalState(() => ({members, addMember}))