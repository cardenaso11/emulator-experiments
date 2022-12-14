# This file has been generated by node2nix 1.11.1. Do not edit!

{nodeEnv, fetchurl, fetchgit, nix-gitignore, stdenv, lib, globalBuildInputs ? []}:

let
  sources = {
    "csstype-3.1.1" = {
      name = "csstype";
      packageName = "csstype";
      version = "3.1.1";
      src = fetchurl {
        url = "https://registry.npmjs.org/csstype/-/csstype-3.1.1.tgz";
        sha512 = "DJR/VvkAvSZW9bTouZue2sSxDwdTN92uHjqeKVm+0dAqdfNykRzQ95tay8aXMBAAPpUiq4Qcug2L7neoRh2Egw==";
      };
    };
    "fp-ts-2.12.3" = {
      name = "fp-ts";
      packageName = "fp-ts";
      version = "2.12.3";
      src = fetchurl {
        url = "https://registry.npmjs.org/fp-ts/-/fp-ts-2.12.3.tgz";
        sha512 = "8m0XvW8kZbfnJOA4NvSVXu95mLbPf4LQGwQyqVukIYS4KzSNJiyKSmuZUmbVHteUi6MGkAJGPb0goPZqI+Tsqg==";
      };
    };
    "monocle-ts-2.3.13" = {
      name = "monocle-ts";
      packageName = "monocle-ts";
      version = "2.3.13";
      src = fetchurl {
        url = "https://registry.npmjs.org/monocle-ts/-/monocle-ts-2.3.13.tgz";
        sha512 = "D5Ygd3oulEoAm3KuGO0eeJIrhFf1jlQIoEVV2DYsZUMz42j4tGxgct97Aq68+F8w4w4geEnwFa8HayTS/7lpKQ==";
      };
    };
    "solid-js-1.5.7" = {
      name = "solid-js";
      packageName = "solid-js";
      version = "1.5.7";
      src = fetchurl {
        url = "https://registry.npmjs.org/solid-js/-/solid-js-1.5.7.tgz";
        sha512 = "L1UuyMuZZARAwzXo5NZDhE6yxc14aqNbVOUoGzvlcxRZo1Cm4ExhPV0diEfwDyiKG/igqNNLkNurHkXiI5sVEg==";
      };
    };
    "ts-pattern-4.0.5" = {
      name = "ts-pattern";
      packageName = "ts-pattern";
      version = "4.0.5";
      src = fetchurl {
        url = "https://registry.npmjs.org/ts-pattern/-/ts-pattern-4.0.5.tgz";
        sha512 = "Bq44KCEt7JVaNLa148mBCJkcQf4l7jtLEBDuDdeuLynWDA+1a60P4D0rMkqSM9mOKLQbIWUddE9h3XKyKwBeqA==";
      };
    };
  };
  args = {
    name = "emulator-experiments-ts";
    packageName = "emulator-experiments-ts";
    version = "0.0.0";
    src = ./.;
    dependencies = [
      sources."csstype-3.1.1"
      sources."fp-ts-2.12.3"
      sources."monocle-ts-2.3.13"
      sources."solid-js-1.5.7"
      sources."ts-pattern-4.0.5"
    ];
    buildInputs = globalBuildInputs;
    meta = {
      description = "";
      license = "MIT";
    };
    production = true;
    bypassCache = true;
    reconstructLock = false;
  };
in
{
  args = args;
  sources = sources;
  tarball = nodeEnv.buildNodeSourceDist args;
  package = nodeEnv.buildNodePackage args;
  shell = nodeEnv.buildNodeShell args;
  nodeDependencies = nodeEnv.buildNodeDependencies (lib.overrideExisting args {
    src = stdenv.mkDerivation {
      name = args.name + "-package-json";
      src = nix-gitignore.gitignoreSourcePure [
        "*"
        "!package.json"
        "!package-lock.json"
      ] args.src;
      dontBuild = true;
      installPhase = "mkdir -p $out; cp -r ./* $out;";
    };
  });
}
