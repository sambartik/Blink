import React, { useState } from "react";

import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { AppBarBackOnly } from "../../../components/appBar/backOnly";
import {
	delServer,
	getAllServers,
	getDefaultServer,
	setDefaultServer,
} from "../../../utils/storage/servers";
import { delUser } from "../../../utils/storage/user";
import "./serverList.module.scss";

const ServerList = () => {
	const navigate = useNavigate();
	const [serverState, setServerState] = useState(null);
	const { enqueueSnackbar } = useSnackbar();
	const servers = useQuery({
		queryKey: ["servers-list"],
		queryFn: async () => await getAllServers(),
	});

	const defaultServer = useQuery({
		queryKey: ["default-server"],
		queryFn: async () => await getDefaultServer(),
	});

	const handleServerChange = useMutation({
		mutationFn: async () => {
			await delUser();
			console.log(serverState);
			await setDefaultServer(serverState);
		},
		onSuccess: async () => {
			navigate("/login/index");
		},
		onError: (error) => {
			console.error(error);
			enqueueSnackbar("Error changing the server", {
				variant: "error",
			});
		},
	});

	const handleDelete = async (serverId) => {
		await delServer(serverId);

		if (serverId === defaultServer.data) {
			await delUser();
			await servers.refetch();

			if (servers.length > 0) {
				setDefaultServer(servers[0].id);
			} else {
				navigate("/setup/server");
			}
		}

		servers.refetch();
		defaultServer.refetch();
	};

	return (
		<div className="server-list">
			<AppBarBackOnly />
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "40vw",
					alignItems: "center",
					marginBottom: "2em",
				}}
			>
				<Typography variant="h3" fontWeight={200}>
					Servers
				</Typography>
				<IconButton
					style={{
						fontSize: "1.64em",
					}}
					onClick={() => navigate("/setup/server")}
				>
					<div className="material-symbols-rounded">add</div>
				</IconButton>
			</div>
			<Paper className="server-list-container">
				{servers.isSuccess &&
					servers.data.map((server, index) => (
						<div key={index} className="server-list-item">
							<div className="material-symbols-rounded server-list-item-icon">
								dns
							</div>
							<div className="server-list-item-info">
								<Typography
									variant="h6"
									fontWeight={400}
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									{server.systemInfo.ServerName}
									{server.id === defaultServer.data && (
										<Chip
											label={
												<Typography
													variant="caption"
													fontWeight={600}
													fontFamily="JetBrains Mono Variable"
												>
													Current
												</Typography>
											}
											color="info"
											sx={{
												ml: 2,
												width: "5.4em",
											}}
											size="medium"
										/>
									)}
								</Typography>
								<Typography
									variant="subtitle1"
									style={{
										opacity: 0.7,
									}}
									fontWeight={300}
								>
									{server.address}
								</Typography>
								<Typography
									variant="subtitle2"
									style={{
										opacity: 0.5,
									}}
									fontWeight={300}
								>
									Version: {server.systemInfo.Version}
								</Typography>
							</div>
							<div className="server-list-item-buttons">
								<IconButton
									style={{
										fontSize: "1.64em",
									}}
									onClick={() => {
										setServerState(server.id);
										handleServerChange.mutate();
									}}
									disabled={handleServerChange.isPending}
								>
									<div className="material-symbols-rounded">start</div>
								</IconButton>
								<IconButton
									style={{
										fontSize: "1.64em",

										color: red[400],
									}}
									disabled={handleServerChange.isPending}
									onClick={() => {
										handleDelete(server.id);
									}}
								>
									<div className="material-symbols-rounded">delete_forever</div>
								</IconButton>
							</div>
						</div>
					))}
			</Paper>
		</div>
	);
};
export default ServerList;
