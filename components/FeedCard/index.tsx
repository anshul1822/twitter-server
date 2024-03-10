import Image from "next/image";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineRetweet } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";
import { MdOutlineFileUpload } from "react-icons/md";

const FeedCard: React.FC = () => {
    return (
        <div className="border border-l-0 border-r-0 border-b-0 border-gray-600 p-4 hover:bg-slate-950 cursor-pointer transition-all">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-1">
                    <Image src="https://avatars.githubusercontent.com/u/68806086?v=4" alt="avatar"
                        height={50} width={50} />
                </div>
                <div className="col-span-11">
                    <h5> Anshul Sinha </h5>
                    <p className="text-sm">2018. First big purchase for myself with some contribution; it was 66k, paid 30k by saving freelancing money and teaching piano to kids of the staff in the university (it was a residential university).

                        The happiness I felt was insane that day :)

                        Google's "remember this day"</p>
                    <div className="flex justify-between items-center mt-5 text-xl pr-10">
                        <div>
                        <BiMessageRounded />
                        </div>
                        <div>
                        <AiOutlineRetweet />
                        </div>
                        <div>
                        <AiOutlineHeart />
                        </div>
                        <div>
                        <MdOutlineFileUpload />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedCard;