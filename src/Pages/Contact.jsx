import React from "react";

export default function Contact() {
  return (
    <form className="flex flex-col items-center text-sm">
      <p className="text-lg text-blue-600 font-medium pb-2">Contact Us</p>
      <h1 className="text-4xl font-semibold text-slate-700 pb-4">
        Get in touch with us
      </h1>
      <p className="text-sm text-gray-500 text-center pb-10">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        <br />
        Lorem Ipsum has been the industry's standard dummy text.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-8 w-[350px] md:w-[700px]">
        <div className="w-full">
          <label className="text-black/70" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
          />
        </div>
        <div className="w-full">
          <label className="text-black/70" htmlFor="email">
            Your Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 p-2 mt-2 w-full border border-gray-500/30 rounded outline-none focus:border-indigo-300"
          />
        </div>
      </div>

      <div className="mt-6 w-[350px] md:w-[700px]">
        <label className="text-black/70" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          className="w-full mt-2 p-2 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300"
        ></textarea>
      </div>

      <button
        type="submit"
        className="mt-5 bg-indigo-600 text-white h-12 w-56 px-4 rounded active:scale-95 transition"
      >
        Send Message
      </button>
    </form>
  );
}
