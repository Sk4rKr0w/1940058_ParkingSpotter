const Info = ({ title, isReverted, text, src }) => {
    return (
        <div
            className={`border-1 border-gray-500/50 rounded-xl flex flex-col justify-around items-center m-4 p-4 gap-2  ${
                isReverted
                    ? "md:flex-row-reverse bg-orange-500"
                    : "md:flex-row bg-white"
            }`}
        >
            <img
                src={src}
                alt=""
                className="w-40 h-40 object-cover rounded-full border-5 border-black/75"
            />
            <div className="text-center flex flex-col gap-4">
                <h1
                    className={`text-2xl font-medium ${
                        isReverted
                            ? "md:text-left text-black"
                            : "md:text-right text-orange-500"
                    }`}
                >
                    {title}
                </h1>
                <p
                    className={`max-w-[55ch] text-md ${
                        isReverted ? "md:text-left" : "md:text-right"
                    }`}
                >
                    {text}
                </p>
            </div>
        </div>
    );
};

export default Info;
