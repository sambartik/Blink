import { useQuery } from "@tanstack/react-query";
import React, { useLayoutEffect } from "react";

import { Chip, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { AppBarBackOnly } from "@/components/appBar/backOnly.jsx";

import { getUserApi } from "@jellyfin/sdk/lib/utils/api/user-api";

import { ErrorNotice } from "@/components/notices/errorNotice/errorNotice.jsx";
import "./login.scss";

import QuickConnectButton from "@/components/buttons/quickConnectButton";
import { useApiInContext } from "@/utils/store/api";
import { useBackdropStore } from "@/utils/store/backdrop.js";
import type { UserDto } from "@jellyfin/sdk/lib/generated-client";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import avatar from "../../../assets/icons/avatar.png";

export const Route = createFileRoute("/_api/login/list")({
	component: LoginPublicUsersList,
});

const UserCard = ({ user }: { user: UserDto }) => {
	const api = useApiInContext((s) => s.api);
	return (
		<Link
			to="/login/$userId/$userName"
			params={{ userId: user.Id ?? "", userName: user.Name ?? "" }}
			className="user-list-item user-card"
		>
			<div className="user-card-image-container">
				{user.PrimaryImageTag ? (
					<img
						className="user-card-image"
						alt={"user"}
						src={`${api.basePath}/Users/${user.Id}/Images/Primary?quality=80&tag=${user.PrimaryImageTag}`}
					/>
				) : (
					<img className="user-card-image" alt="user" src={avatar} />
				)}
			</div>
			<Typography mt={1} align="center">
				{user.Name}
			</Typography>
		</Link>
	);
}

function LoginPublicUsersList() {
	const navigate = useNavigate();

	const api = useApiInContext((s) => s.api);

	const handleChangeServer = () => {
		navigate({ to: "/setup/server/list" });
	};
	const users = useQuery({
		queryKey: ["login", "public-users"],
		queryFn: async () => {
			if (!api) return [];
			const result = await getUserApi(api).getPublicUsers();
			return result.data;
		},
		enabled: Boolean(api),
	});

	const setBackdrop = useBackdropStore((state) => state.setBackdrop);	

	useLayoutEffect(() => {
		setBackdrop("", "");
	}, []);
	if (users.isSuccess) {
		return (
			<div className="login-container">
				<Typography variant="h4" align="center">
					Users
				</Typography>

				<div className="user-list-container roundedScrollbar">
					{users.data.map((item) => {
						return <UserCard user={item} key={item.Id} />;
					})}
				</div>

				{/* <div className="buttons">
						<Button
							color="secondary"
							variant="contained"
							className="userEventButton"
							onClick={handleChangeServer}
						>
							Change Server
						</Button>
						<QuickConnectButton />
					</div> */}
				<Chip
					style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
					label={
						<Typography variant="body2" align="center">
							Don't see your user? Try using{" "}
							<Link to="/login/manual">Manual Login</Link> or{" "}
							<Link to="/setup/server/list">Changing Server</Link>
						</Typography>
					}
				/>
			</div>
		);
	}
	if (users.isError) {
		return <ErrorNotice />;
	}
}
