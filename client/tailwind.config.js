/** @type {import('tailwindcss').Config} */
export default { content:["./index.html","./src/**/*.{ts,tsx}"],
theme:{ extend:{ colors:{ brand:{ DEFAULT:"#1273ea"}}, borderRadius:{'2xl':'1rem'}, boxShadow:{ card:"0 6px 24px rgba(0,0,0,.06)"} }}, plugins:[] }