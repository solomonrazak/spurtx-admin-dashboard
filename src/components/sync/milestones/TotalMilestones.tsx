import mile1 from "../../../assets/images/svg/mile1.svg";
import mile2 from "../../../assets/images/svg/mile2.svg";

const TotalMilestones = () => {
  return (
    <div className="bg-white p-3 rounded-[5px] shadow-md w-135 flex gap-5 mt-4">
      <div className="bg-gradient-to-r from-[#00A15D] to-[#C16407] w-full rounded-md p-[1.5px]">
        <div className="bg-bg-primary px-4 py-10 rounded-md">
        <div className="flex justify-between">
          <p className="bg-gradient-to-r from-[#00A15D] to-[#C16407] bg-clip-text text-transparent font-semibold">
            100,000
          </p>
          <img src={mile1} alt="mile" className="" />
        </div>
        <p className="text-primary">Total Milestone</p>
        </div>
        </div>
     

      <div className="bg-gradient-to-r from-[#00A15D] to-[#C16407] w-full rounded-md p-[1.5px]">
        <div className="bg-bg-primary px-3 py-7 rounded-md">
      <div className="flex justify-between">
          <p className="bg-gradient-to-r from-[#00A15D] to-[#C16407] bg-clip-text text-transparent font-semibold">
            <span>06</span><span>/per project</span>
          </p>
          <img src={mile2} alt="mile" className="" />
        </div>
        <p className="text-primary">Avg Milestone Change Frequency</p>
        </div>

      </div>
    </div>
  );
};

export default TotalMilestones;
