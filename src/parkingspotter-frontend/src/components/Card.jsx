const Card = ({ title, text }) => {
    return (
        <div className="relative max-w-[50ch] mx-2">
            <div className="absolute inset-0 bg-[#1c1b1b] rounded-lg -translate-x-4 translate-y-4 shadow-[4px_-4px_20px_rgba(255,255,255,0.6)]"></div>

            <div className="relative bg-[#363333] p-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-medium text-center my-2">
                        {title}
                    </h1>
                    <p className="text-sm">{text}</p>
                </div>
            </div>
        </div>
    );
};

export default Card;
