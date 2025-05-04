import React from 'react'

function CardTemplate({ header, content}) {
  return (
    <div className="flex flex-col col-span-full md:col-span-3 bg-white shadow-sm rounded-lg border border-slate-200 transition delay-150 duration-300 ease-in-out hover:scale-101">
        <div className="px-5 pt-2 pb-5">
            {/* Header */}
            <header className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                    <div>
                        <h2 className="font-semibold text-slate-600">{header}</h2>
                    </div>
                </div>
            </header>
            {/* Content section */}
            <div className="flex items-start">
                <div className="text-sm text-slate-800 mr-2 w-full">
                    <div className="flex flex-col space-y-2">
                        <div className="text-sm font-semibold text-slate-500">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CardTemplate