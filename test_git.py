import subprocess
import os

repo_path = "/Volumes/12AM_VuAn_SSD/Code/Vu An Edit Web"
os.chdir(repo_path)

def run_git(args):
    print(f"Running: git {' '.join(args)}")
    result = subprocess.run(["git"] + args, capture_output=True, text=True)
    print(f"STDOUT: {result.stdout}")
    print(f"STDERR: {result.stderr}")
    print(f"RETURN CODE: {result.returncode}")
    return result

print("--- CONFIG ---")
run_git(["config", "--local", "user.email", "vuan.edit@gmail.com"])
run_git(["config", "--local", "user.name", "Vũ An"])

print("\n--- STATUS ---")
run_git(["status"])

print("\n--- ADD ---")
run_git(["add", "."])

print("\n--- COMMIT ---")
run_git(["commit", "-m", "feat: complete website update with logo, slider, and contact form"])

print("\n--- PUSH ---")
run_git(["push", "origin", "main"])
