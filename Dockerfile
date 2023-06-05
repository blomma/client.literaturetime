FROM mcr.microsoft.com/dotnet/aspnet:7.0-jammy-arm64v8 AS base
WORKDIR /app
EXPOSE 80

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:7.0-jammy AS build
WORKDIR /src
ENV NODE_VERSION=18.16.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && corepack enable
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
COPY ["client.literaturetime.csproj", "./"]
RUN dotnet restore "client.literaturetime.csproj"
COPY . .
RUN dotnet build "client.literaturetime.csproj" -c Release -o /app/build

FROM build AS publish
ARG VITE_GIT_VERSION
RUN dotnet publish "client.literaturetime.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "client.literaturetime.dll"]
