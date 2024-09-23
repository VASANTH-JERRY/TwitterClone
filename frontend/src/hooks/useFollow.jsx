import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () =>
{
const queryClient = useQueryClient()

    const {mutate : follow,isPending} = useMutation(
        {
            mutationFn:async(userId)=>
            {
                try {
                    const res = await fetch(`/api/user/follow/${userId}`,{
                        method :'POST'
                    })
                    const data = await res.json();
                    
                    if(!res.ok)
                        throw new Error(data.error||"Something wrong with following and unfollowing user")
    
                    return data
                } catch (error) {
                    throw new Error(error)
                }
            },
            onSuccess:()=>
            {
                toast.success("Successfully done")
                Promise.all(
                    [
                        queryClient.invalidateQueries({queryKey:['authUser']}),
                        queryClient.invalidateQueries({queryKey:['suggestedUsers']})
                    ]
                )
            },
            onError:()=>
            {
                toast.error(error.message)
            }
        }
    )

    return {follow,isPending}
}

export default useFollow;