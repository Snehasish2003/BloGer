

const HoverDown = ({name}) => {
  return (
    <div className="absolute flex justify-center items-center  z-10 h-7 w-20 rounded-2xl bg-[#464748] text-white left-[-15px] bottom-[-37px] p-2" >
      <h1 className=" text-xs">{name}</h1>
    </div>
  )
}

export default HoverDown
