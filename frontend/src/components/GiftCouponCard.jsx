import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (

		<div className='rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] p-px'>
			<motion.div
				className='space-y-4 rounded-lg bg-black p-4 shadow-sm sm:p-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<div className='space-y-4'>
					<div>
						<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-white'>
							Você tem algum cupom?
						</label>
						<input
							type='text'
							id='voucher'
							className='block w-full rounded-lg border border-gray-600 bg-black p-3 text-sm text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400'
							placeholder='Insira o código do cupom'
							value={userInputCode}
							onChange={(e) => setUserInputCode(e.target.value)}
							required
						/>
					</div>

					{!isCouponApplied && (
						<motion.button
							type='button'
							className='flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#606cfc] to-[#ff64c4] hover:brightness-120 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-400'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleApplyCoupon}
						>
							Aplicar código
						</motion.button>
					)}
				</div>
				{isCouponApplied && coupon && (
					<div className='mt-4'>
						<h3 className='text-lg font-medium text-white'>Cupom aplicado</h3>

						<p className='mt-2 text-sm text-white'>
							{coupon.code} - {coupon.discountPercentage}% off
						</p>

						<motion.button
							type='button'
							className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleRemoveCoupon}
						>
							Remover Cupom
						</motion.button>
					</div>
				)}

				{coupon && !isCouponApplied && (
					<div className='mt-4'>
						<h3 className='text-lg font-medium text-white'>Seus cupons:</h3>
						<p className='mt-2 text-sm text-white'>
							{coupon.code} - {coupon.discountPercentage}% off
						</p>
					</div>
				)}
			</motion.div>
		</div>
	);
};
export default GiftCouponCard;