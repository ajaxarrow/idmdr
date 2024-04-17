import membersData from "../data/members.ts";
import {ref} from "vue";
import {Member} from "../interfaces/member.interface.ts";
import {createGlobalState} from "@vueuse/core";


const members = ref(membersData);

const addMember = (member: Member) => {
  members.value.push(member);
}

export const useMemberStore = createGlobalState(() => ({members, addMember}))