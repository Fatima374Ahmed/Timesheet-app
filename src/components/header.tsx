export default function Header() {
    return(
        <>
            <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
                <div className="flex items-center gap-6">
                <h1 className="font-semibold text-[24px] font-sans">ticktock</h1>
                <span className="text-[#111928] text-[14px] font-medium">Timesheets</span>
                </div>

                <div className="text-sm text-gray-600">John Doe ⌄</div>
            </div>
        </>
    )
}