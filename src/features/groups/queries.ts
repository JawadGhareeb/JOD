import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupsMockStore } from "./mock-store";
import { groupKeys } from "./query-keys";
import type { CreateGroupInput } from "./types";

// TODO: swap `groupsMockStore` for the real groups API. Nothing outside this
// file should need to change when that happens.

export const useMyGroups = () =>
  useQuery({ queryKey: groupKeys.mine(), queryFn: groupsMockStore.myGroups });

export const useSuggestedGroups = () =>
  useQuery({ queryKey: groupKeys.suggested(), queryFn: groupsMockStore.suggested });

export const useDiscoverGroups = () =>
  useQuery({ queryKey: groupKeys.discover(), queryFn: groupsMockStore.discover });

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupsMockStore.join(groupId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => groupsMockStore.leave(groupId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGroupInput) => groupsMockStore.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}
