import { SearchIcon } from "lucide-react";
import IconInput from "../icon-input";

export default function Searchbar() {
  return (
    <IconInput
      placeholder="Search For Exams"
      EndIcon={<SearchIcon style={{ right: "20px" }} />}
      className="rounded-full w-[1200px] h-14 [&>button]:right-6 [&_svg]:scale-150"
      style={{ paddingRight: "50px", paddingLeft: "20px" }}
    />
  );
}
