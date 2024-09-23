import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUserProfile = () =>
{

    const queryClient = useQueryClient()
    const {mutateAsync:updateProfileMutation,isPending:isUpdatingProfile,error} = useMutation(
		{
			mutationFn:async(formData) =>
			{
				try {
					const res = await fetch("/api/user/update",{
						method:"POST",
						headers:{
							"Content-Type" : "application/json"
						},
						body:JSON.stringify(formData)
					})

					const data = await res.json();

					if(!res.ok)
					{
						throw new Error(data.error || "Something wrong in updating Profile")
					}

					return data
				} catch (error) {
					throw new Error(error)
				}
			},
			onSuccess:()=>
			{
				toast.success("Profile updated Successfully")
				Promise.all(
					[
						queryClient.invalidateQueries({queryKey:['authUser']}),
						queryClient.invalidateQueries({queryKey:['userProfile']})
					]
				)
			},
			onError:(error)=>
			{
				toast.error(error.message)
			}
		}
	)

    return ({updateProfileMutation,isUpdatingProfile})

}

export default useUserProfile;