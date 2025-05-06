import React from 'react'

function CardTemplate({ header, content}) {
    const renderContent = () => {
        if(typeof content === 'string' || typeof content === 'number') {
            return (
                <div className="text-xl font-bold text-slate-600">
                    {content}
                </div>
            );
        }

        if (typeof content === 'object' & content !== null && !Array.isArray(content)) {
            return (
                <div className="text-xs italic text-slate-800 w-full">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {Object.entries(content).map(([key, value]) => (
                            <div key={key}>
                                <div className="font-medium text-slate-600 capitalize text-left">
                                    { key}: 
                                <span className="font-semibold text-slate-700 ml-1">
                                    { value }
                                </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return <div className="text-sm text-slate-500">Invalid content</div>;
    };
  return (
    <div className="flex flex-col col-span-full md:col-span-3 bg-white shadow-sm rounded-lg border border-slate-200 transition delay-150 duration-300 ease-in-out hover:scale-101">
        <div className="px-5 pt-3 pb-5">
            {/* Header */}
            <header className="mb-2">
                <div className="flex items-center space-x-3">
                    <div>
                        <h2 className="font-semibold text-slate-600">{header}</h2>
                    </div>
                </div>
            </header>
            {/* Content section */}
            <div className="flex items-start">
                { renderContent() }
            </div>
        </div>
    </div>
  )
}

export default CardTemplate