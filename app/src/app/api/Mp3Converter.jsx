export default function Mp3Converter() {
    return(
        <form class="w-1/2">
            <div class="flex items-center border-b border-teal-200 py-2 w-full">
                <input class="appearance-none bg-transparent border-none w-full text-white-100 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Paste your YouTube URL here" aria-label="URL" />
                <button class="flex-shrink-0 bg-transparent hover:bg-teal-200 border-0 text-m text-Tblue-50 py-1 px-2 rounded" type="button">
                    Convert
                </button>
            </div>
        </form>
    );
}