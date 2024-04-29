import { type TextInputCompTypes } from "../types";

export default function TextInput({
  error,
  inputType,
  onUpdate,
  placeHolder,
  string,
}: TextInputCompTypes) {
  return (
    <>
      <input
        type={inputType}
        placeholder={placeHolder}
        className="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
        value={string}
        onChange={(e) => onUpdate(e.target.value)}
        autoComplete="off"
      />
      <div className="text-red-500 text-[14px] font-semibold">
        {error ? error : null}
      </div>
    </>
  );
}
