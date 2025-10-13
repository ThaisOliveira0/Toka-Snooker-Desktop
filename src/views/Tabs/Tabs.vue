<template>
  <div class="page-root">
    <header class="topbar">
      <div class="logo">Toka</div>
      <div class="search">
        <input placeholder="Filtrar resultados" />
      </div>
    </header>

        <div class="carousel-wrap">
          <button
            class="arrow left"
            @click="scrollLeft"
            aria-label="scroll left"
          >
            ‹
          </button>
          <div class="cards-container" ref="cardsContainer">
            <TableCard
              v-for="(order, idx) in orders"
              :key="order.table + idx"
              :data="order"
              @close="handleClose"
            />
          </div>
          <button
            class="arrow right"
            @click="scrollRight"
            aria-label="scroll right"
          >
          </button>
        </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Tabs from "@/components/Tabs.vue";
import TableCard from "@/components/TableCard.vue";
import { orders } from "@/mock/orders.js";

const cardsContainer = ref(null);

const handleClose = (table) => {
  console.log("Fechar comanda:", table);
};

const getScrollAmount = () => {
  if (!cardsContainer.value) return 0;
  return cardsContainer.value.clientWidth / 2;
};

const scrollLeft = () => {
  if (!cardsContainer.value) return;
  cardsContainer.value.scrollBy({
    left: -getScrollAmount(),
    behavior: "smooth",
  });
};

const scrollRight = () => {
  if (!cardsContainer.value) return;
  cardsContainer.value.scrollBy({
    left: getScrollAmount(),
    behavior: "smooth",
  });
};
</script>

<style src="./tabs.css"></style>
