import { useEffect, useState } from "react";
import { HandPalm, Play } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { differenceInSeconds } from "date-fns";

import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	Separator,
	StartCountdownButton,
	StopCountdownButton,
	TaskInput,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

	function handleCreateNewCycle(data: NewCycleFormData) {
		const id = String(new Date().getTime());
		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);
		setAmountSecondsPassed(0);

		reset();
	}

	function handleInterruptCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id == activeCycleId) {
					return { ...cycle, interruptedDate: new Date() };
				} else {
					return cycle;
				}
			})
		);
		setActiveCycleId(null);
	}

	const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId);

	const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

	const minutesAmount = Math.floor(currentSeconds / 60);
	const secondsAmount = currentSeconds % 60;

	const minutes = String(minutesAmount).padStart(2, "0");
	const seconds = String(secondsAmount).padStart(2, "0");

	const task = watch("task");
	const isSubmitDisabled = !task;

	useEffect(() => {
		if (activeCycle) {
			document.title = `${minutes}:${seconds}`;
		}
	}, [minutes, seconds, activeCycle]);

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<NewCycleForm />

				<Countdown />

				{activeCycle ? (
					<StopCountdownButton onClick={handleInterruptCycle} type="button">
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisabled} type="submit">
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
