import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import PolygonUp from "./components/PolygonUp";
import "./App.css";

const initValue = 523;
const annualValues = [543, 575, 605, 635, 659];
annualValues.unshift(initValue);

const maxValue = Math.max(...annualValues);
const minValue = Math.min(...annualValues);

function App() {
	const canvasRef = useRef();

	useEffect(() => {
		var ctx = canvasRef.current.getContext("2d");

		function paintCurve() {
			ctx.lineWidth = 4;
			var grad = ctx.createLinearGradient(50, 50, 200, 50);
			grad.addColorStop(0, "#854AF2");
			grad.addColorStop(1, "#1A92EA");

			ctx.strokeStyle = grad;

			const points = annualValues.map((value, i) => {
				return {
					x: 21 + i * 43,
					y: 120 - (getY(value) + 6),
				};
			});

			for (var i = 0; i < points.length - 1; i++) {
				var x_mid = (points[i].x + points[i + 1]?.x) / 2;
				var y_mid = (points[i].y + points[i + 1]?.y) / 2;

				if (
					i === 0 ||
					(points[i].y > points[i + 1]?.y &&
						points[i].y > points[i - 1]?.y)
				) {
					y_mid = y_mid + Math.abs(points[i].y - points[i + 1].y) / 2; // :)
				}

				if (
					(i === points.length - 2 &&
						points[i - 1].y > points[i].y) ||
					(points[i].y < points[i + 1]?.y &&
						points[i].y < points[i - 1]?.y) ||
					(points[i].y < points[i - 1]?.y &&
						points[i].y < points[i + 2]?.y)
				) {
					y_mid = y_mid - Math.abs(points[i].y - points[i + 1].y) / 2; // :(
				}
				ctx.beginPath();

				ctx.moveTo(points[i].x, points[i].y);
				ctx.quadraticCurveTo(
					x_mid,
					y_mid,
					points[i + 1]?.x,
					points[i + 1]?.y
				);
				ctx.stroke();
			}
		}

		paintCurve();

		let t = 0;
		function animation() {
			t = t + 2;

			ctx.clearRect(
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height
			);

			paintCurve();

			ctx.clearRect(
				canvasRef.current.width,
				0,
				-canvasRef.current.width + t,
				canvasRef.current.height
			);

			if (t < 500) {
				requestAnimationFrame(animation);
			}
		}

		setTimeout(() => {
			animation();
			window.requestAnimationFrame(animation);
		}, 4000);
	}, []);

	function getY(value) {
		if (
			initValue > minValue ||
			annualValues[1] === maxValue ||
			annualValues[2] === maxValue
		) {
			return 37 + (30 * (value - minValue)) / (maxValue - minValue);
		}

		return 37 + (68 * (value - minValue)) / (maxValue - minValue);
	}

	function calculateGrowth(value) {
		return ((100 * (value - initValue)) / initValue).toFixed(1);
	}

	return (
		<BlurCard>
			<Title>5-Year Forecasted Home</Title>

			<Container>
				<Row>
					<GrowthCard>
						<Percentage>
							{calculateGrowth(
								annualValues[annualValues.length - 1]
							)}
						</Percentage>

						<Center>
							<PolygonUp />%
						</Center>

						<Center>
							<Text white bold>
								5 year growth
							</Text>
						</Center>
					</GrowthCard>
				</Row>

				<Columns>
					{annualValues.map((value, i) => {
						return (
							<Column>
								{(i === 0 || i === annualValues.length - 1) && (
									<Text
										bold
										y={getY(value) + 16}
										delayToAppear={() => {
											if (i === 0) {
												return "4s";
											} else if (
												i ===
												annualValues.length - 1
											) {
												return "5.5s";
											}
										}}
									>
										${value}K
									</Text>
								)}

								<Dot
									value={getY(value)}
									delayToAppear={i === 0 && "4s"}
								/>

								<Label>
									<VerticalLine />
									<Text mt={4}>
										{i === 0 ? "NOW" : i + 2022}
									</Text>
								</Label>
							</Column>
						);
					})}
					<Canvas width="255" height="120" ref={canvasRef} />
				</Columns>

				<Lines>
					<Line />
					<Line />
					<Line />
					<Line />
					<Line />
					<AxisLine />
				</Lines>
			</Container>
		</BlurCard>
	);
}

export default App;

const appear = keyframes`
	0% {
		opacity: 0;

	}
	100% {
		opacity: 1;
	}
`;

const disappear = keyframes`
	0% {
		opacity: 1;

	}
	100% {
		opacity: 0;
	}
`;

const Center = styled.div`
	margin: auto;
	font-size: 14px;
	font-family: "Roboto", sans-serif;
	font-weight: 600;
	/* line-height: 1px; */
	margin-bottom: 0;
	color: #fff;
	margin-left: 4px;
	display: flex;
	flex-direction: column;
	max-width: 46px;
`;

const BlurCard = styled.div`
	background: rgba(255, 255, 255, 0.88);
	border-radius: 6px;
	width: 285px;
	height: 176px;
	position: absolute;
	top: 30%;
	right: 20%;
	box-sizing: border-box;
	padding: 15px;

	backdrop-filter: blur(4px);
`;

const Title = styled.p`
	color: #122448;
	font-size: 16px;
	font-weight: 700;
	height: 22px;
	margin-top: 0;
	font-family: "Poppins", sans-serif;
	margin-bottom: 10px;
`;

const Container = styled.div`
	height: 114px;
	width: 255px;
	margin-bottom: 0;
	margin-top: 0;
`;

const Row = styled.div`
	width: 100%;
	height: 34px;
`;

const GrowthCard = styled.div`
	background: linear-gradient(to right, #854af2, #516dee, #1a92ea);
	height: 100%;
	width: fit-content;
	border-radius: 6px;
	padding: 5px;
	box-sizing: border-box;
	display: flex;
	/* text-align: center; */
	text-justify: bottom;
`;

const Percentage = styled.div`
	font-size: 20px;
	font-family: "Poppins", sans-serif;
	font-weight: bold;
	color: #fff;
	letter-spacing: 0.04em;
	margin-top: auto;
	vertical-align: baseline;
	line-height: 20px;
`;

const Text = styled.p`
	font-size: 10px;
	font-family: "Roboto", sans-serif;
	font-weight: ${({ bold }) => bold && "bold"};
	color: ${({ white }) => (white ? "#fff" : "#122448")};
	text-transform: uppercase;
	margin: auto;
	line-height: 11px;
	margin-top: ${({ mt }) => mt && mt}px;
	position: ${({ y }) => y && "absolute"};
	bottom: ${({ y }) => y && y}px;
	animation: ${disappear} 0.5s ease-in-out 1, ${appear} 0.5s ease-in-out;
	animation: ${({ delayToAppear }) => !delayToAppear && "none"};
	animation-fill-mode: forwards;
	animation-delay: 3s, ${({delayToAppear}) => delayToAppear || "5s"};
`;

const Lines = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 14px;
	position: relative;
	/* top: -6px; */
	bottom: 10px;
	z-index: -1;
`;

const Line = styled.hr`
	width: 255px;
	height: 0px;
	margin: 0;
	border: 0.5px dashed #12244840;
`;

const AxisLine = styled.hr`
	width: 255px;
	border: 1px solid #999;
	border-radius: 1px;
	height: 0px;
	margin-top: 0;
`;

const Columns = styled.div`
	width: 100%;
	height: 120px;
	display: flex;
	flex-direction: row;
	position: absolute;
	z-index: 1;
	bottom: 0;
	max-width: 257px;
`;

const Column = styled.div`
	width: 100%;
	padding-bottom: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	margin-top: auto;
`;

const Label = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: -2px;
`;

const VerticalLine = styled.div`
	width: 0px;
	height: 5px;
	z-index: 1;
	border: 1px solid #999;
	border-radius: 1px;
	margin-bottom: -2px;
`;

const Dot = styled.div`
	background: #fff;
	border-radius: 50%;
	height: 11px;
	width: 11px;
	background: linear-gradient(to right, #854af2 65%, #1a92ea 75%);
	background-attachment: fixed;
	position: absolute;
	z-index: 10;
	bottom: ${({ value }) => `${value}px`};
	&:after {
		content: "";
		position: absolute;
		top: 2.5px;
		left: 2.5px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #fff;
	}
	animation: ${disappear} 0.5s ease-in-out 1, ${appear} 0.5s ease-in-out;
	animation-fill-mode: forwards;
	animation-delay: 2.5s, ${({delayToAppear}) => delayToAppear || "5s"};
`;

const Canvas = styled.canvas`
	position: absolute;
	top: 0px;
	animation: ${disappear} 0.5s ease-in-out 1, ${appear} 0.5s ease-in-out;
	animation-delay: 2.5s, 4s;
	animation-fill-mode: forwards;
`;
