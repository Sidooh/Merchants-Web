# build stage
FROM node:lts-alpine as build

ARG VITE_ACCOUNTS_API_URL
ARG VITE_MERCHANTS_API_URL
ARG VITE_PAYMENTS_API_URL
ARG VITE_SAVINGS_API_URL
ARG VITE_USSD_API_URL

ARG VITE_OTP_RESEND_TIMEOUT

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml vite.config.ts tsconfig.json tsconfig.node.json index.html tailwind.config.ts postcss.config.js ./
COPY src/ ./src/
COPY public/ ./public/

RUN corepack enable
RUN yarn install
RUN yarn run build



# production stage
FROM nginx:stable-alpine

COPY --from=build /app/dist /app
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
